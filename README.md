# LedgerWash 1.0 beta 2

LedgerWash 在本機檢查 Git 任務帳本與交接收據，例如收據所引用的檔案是否存在、內容是否符合登錄的雜湊。

**[下載最新版試用包｜1.0.0b2 ZIP](https://raw.githubusercontent.com/taipei49314/taipei49314.github.io/ledgerwash-beta/LedgerWash-1.0.0b2-beta.zip)**

需要 Python 3.11 以上與 Git。解壓縮後開啟 `README.md`，依你的作業系統安裝隨附的 wheel，再用範例帳本試掃。試用包可以離線使用。Windows 和 Linux 已驗過這份 ZIP，歡迎提供 macOS 試用結果。

Linux 或 WSL 可用 `python3 -m zipfile -e LedgerWash-1.0.0b2-beta.zip ledgerwash-beta` 解壓。

| 套件版本 | 規格 | ZIP 的 SHA-256 |
| --- | --- | --- |
| `1.0.0b2` | Spec 6 | `92610bc148f3b90f6cc048894cac710667ce45278c1b460469f38f97eb879ea8` |
| [舊版 1.0.0b1 ZIP](https://raw.githubusercontent.com/taipei49314/taipei49314.github.io/ledgerwash-beta/LedgerWash-1.0.0b1-beta.zip) | Spec 6 | `6b4f823c82112c102919016e0da8231122a0bf2dbcbec1340c292dbd9e604966` |

## 使用自己的帳本

從[帳本格式指南](docs/beta/ledger-format.md)開始。b2 已內附指南、可複製的任務、操作收據、JSON Schema 和完整的 Git 操作步驟。正向範例預期退出碼為 0，coverage 完整。若使用 b1，請另下載[格式範例補充包](https://raw.githubusercontent.com/taipei49314/taipei49314.github.io/ledgerwash-beta/LedgerWash-format-v1.zip)，把其中的 `docs` 和 `schema` 解壓到 `demo.bundle` 旁。

## 判讀掃描結果

b2 將掃描退出碼、達門檻的新增發現、覆蓋情形與驗證缺口分行顯示。大帳本預設按種類彙總缺口；加 `--details` 可查看逐筆原因。

| 掃描結果 | 讀法 |
| --- | --- |
| `demo-head` 未帶 baseline，退出碼 1 | 有兩個新增 High，另有兩項未由 baseline 接受的 mismatch。任一類都足以阻擋。 |
| 在 `demo-head` 建完整 baseline，再掃同一版，退出碼 0 | 原有問題已納入基準。證據本身仍有 mismatch，因此 `coverage.complete` 仍為 false。 |
| 兩次都出現 `self_signing` | 這是執行真實性的驗證缺口。`UNKNOWN` 表示缺少獨立驗證。 |

`qualify` 用來檢查試用安裝。`release-gate` 需要 LedgerWash 維護者的原始碼與發布證據。在一般帳本或解壓目錄執行它，無法評估你的安裝。

## 試用回饋

請到[公開回報入口](https://github.com/taipei49314/taipei49314.github.io/issues/new?title=%5BLedgerWash%20beta%5D%20)，或回覆 X 上的招募貼文。留下作業系統、Python 版本、操作步驟、預期與實際結果。若是看不懂掃描輸出，請貼出那一行並說明你原本怎麼理解。公開回報時請先移除私有資料。

若想參加 10 分鐘的首次使用測試，請在開始試用前回覆招募貼文。若想提供獨立帳本做盲測，也請先聯絡維護者安排封存。
