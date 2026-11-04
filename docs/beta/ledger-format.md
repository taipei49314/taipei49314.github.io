# 讓 LedgerWash 掃描自己的帳本

內建的 `ec` reader 在指定的 Git commit 中讀取任務與操作收據。外部專案可以採用同一個檔案格式。每個任務有一份目前狀態，每次操作有一份新的收據，兩者透過任務 ID 和歷史紀錄互相連結。

| 內容 | 在你的 Git repo 裡 | 可直接打開的範例 |
| --- | --- | --- |
| 任務現況 | `governance/tasks/T-101.json` | [一筆已認領的任務](examples/governance/tasks/T-101.json) |
| 操作收據 | `evidence/task-operations/<operation_id>.json` | [認領任務時留下的收據](examples/evidence/task-operations/00000000-0000-4000-8000-000000000101.json) |
| 被引用的證據 | 例如 `evidence/notes/clean-note.md` | 隨附 `demo.bundle` 的 `demo-base~1` 已含此檔。 |

任務和收據都用 UTF-8 JSON，放在表中指定目錄的第一層。任務檔名須符合記錄的 `id`，操作檔名須符合收據中的 `operation_id`。掃描會讀 Git 物件與歷史，因此要先提交檔案、保留收據和來源 blob 所在的 commit。

## 先跑一個完整的正向範例

從解壓後的試用包根目錄操作。以下的 `python` 指已安裝 beta wheel 的虛擬環境直譯器。在 PowerShell 可用 `.\.venv\Scripts\python.exe`，在 Linux 或 macOS 可用 `.venv/bin/python`。

```shell
git clone ./demo.bundle format-demo
git -C format-demo switch --detach demo-base~1
python -c "import shutil; shutil.copytree('docs/beta/examples', 'format-demo', dirs_exist_ok=True)"
git -C format-demo add -- governance/tasks evidence/task-operations
git -C format-demo -c user.name=Example -c user.email=example@example.invalid commit -m "Record example claim"
python -m ledgerwash scan ./format-demo --at HEAD --reader ec --out format-result.json
```

預期退出碼為 `0`，輸出檔中的 `verdict` 為 `pass`，`coverage.complete` 為 `true`。這兩份 JSON 的來源、時間和 ID 屬於合成範例。新專案請從下一次實際操作開始記錄自己的資料。

原來的 `demo-base` 和 `demo-head` 供練習找錯。可以比較 `git -C format-demo show demo-base:evidence/task-operations/00000000-0000-4000-8000-000000000101.json` 與本頁的收據範例。兩者引用同一個證據 blob，原始示範刻意填入錯誤指紋。

## 記下自己的第一筆操作

1. **先提交證據。** 將實際要引用的工作產物放入 repo，提交後以 `git rev-parse HEAD` 記下完整 SHA。範例收據選用 `expected-head-blob`，因此它的 `expected_head` 和 `request.expected.head` 都填這個 SHA。
2. **建立任務。** 用一個新任務 ID，例如 `T-101`。記下執行人、實際時間、描述、狀態和證據路徑。第一次認領使用 `CLAIMED`；`status` 開頭也寫 `CLAIMED`。沒有交接就把 `handoff` 填為 `null`。
3. **建立操作收據。** 為操作與請求產生 UUID，分別登在收據與 `request` 的對應欄位。以操作 UUID 命名收據檔。任務的 `history` 加入指向這個檔案的 `operation` 紀錄。第一次認領的 `before_record` 和 `before_record_sha256` 填 `null`，`after_record` 放入更新後的完整任務。
4. **計算雜湊。** 任務快照用 UTF-8 標準化 JSON 的 SHA-256。操作意圖用同一算法處理 `request` 的副本，先刪除 `operation_id`、`at`、`expected.head` 與 `summary.checked_at`，保留其餘欄位和留下的空物件。證據檔的指紋則取自 Git 原始 blob 位元組，可依下例計算。
5. **提交並驗證。** 同一次提交包含任務及收據，再以 `python -m ledgerwash scan <repo> --at <commit> --summary` 檢查。此後每次變更新增一份收據，`before_record` 對應上一版任務，`after_record` 對應新狀態，任務的 `history` 依序追加。

```python
import hashlib
import json
import subprocess

def snapshot_hash(record):
    data = json.dumps(record, sort_keys=True, ensure_ascii=False,
                      separators=(",", ":"), allow_nan=False).encode("utf-8")
    return hashlib.sha256(data).hexdigest()

def evidence_hash(repo, commit, path):
    blob = subprocess.check_output(["git", "-C", repo, "cat-file", "blob",
                                    f"{commit}:{path}"])
    return hashlib.sha256(blob).hexdigest()
```

## 格式與驗證

| 要檢查的資料 | 公開格式 |
| --- | --- |
| 完整任務 | [task-v1.schema.json](task-v1.schema.json) 指向 receipt schema 的 `$defs.completeTaskRecord`。較寬鬆的基本形狀為 `$defs.taskRecord`。 |
| 操作收據 | [receipt-v1.schema.json](../../schema/receipt-v1.schema.json) 根節點定義基本形狀，`$defs.completeReceipt` 定義完整形狀。 |
| baseline | [baseline-v1.schema.json](../../schema/baseline-v1.schema.json) 定義 `ledgerwash baseline` 所輸出的基準檔。 |

wheel 內也含 `ledgerwash/schema/receipt-v1.schema.json` 與 `ledgerwash/schema/baseline-v1.schema.json`。安裝 wheel 後，以下指令可在試用包根目錄離線核對範例的欄位。

```shell
python -c "from pathlib import Path; from ledgerwash.readers import decode, assert_valid_receipt; p=Path('docs/beta/examples/governance/tasks/T-101.json'); assert_valid_receipt(decode(p.read_bytes()), def_name='completeTaskRecord')"
python -c "from pathlib import Path; from ledgerwash.readers import decode, assert_valid_receipt; p=Path('docs/beta/examples/evidence/task-operations/00000000-0000-4000-8000-000000000101.json'); assert_valid_receipt(decode(p.read_bytes()), def_name='completeReceipt')"
```

這兩個指令成功時安靜退出。要核對檔名綁定、Git 錨點、證據雜湊與前後紀錄是否連續，請執行上方的完整掃描。
