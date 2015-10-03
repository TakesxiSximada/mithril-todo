概要
====

Todo管理アプリ

用語
====

Todo
    目下やらなければならないこと (いつかやる系は含まない)


目的
====

- Todoを消化したくなる
- 通常のTicket管理ではタスクが積み上がることが多いのでTicket管理は積み上げ系としてこのアプリではTodoは積み上がらないようにする

要件
====

PENDING -> STARTED -> SUCCESS
                   -> FAILURE
                   -> PENDING
                   -> REVOKED

- Todoを登録できる (PENDING)
- 登録したTodoを一覧で観れる (PENDING)
- Todoを削除できる (REVOKE)
- Todoを着手できる (STARTED)
- Todoを消化できる (SUCCESS/FAILURE)
- Todoをペンディングできる
