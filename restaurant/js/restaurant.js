const form = document.getElementById('reservationForm');
const results = document.getElementById('results');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // デフォルト送信を防止

    // 値を取得
    const name = document.getElementById('name').value.trim();
    const datetime = document.getElementById('datetime').value.trim();
    const people = document.getElementById('people').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // バリデーションチェック
    if (!name || !datetime || !people || !phone || !email || !message) {
        results.innerHTML = '<p class="error">すべての項目を入力してください。</p>';
        return;
    }

    // メール形式の確認
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        results.innerHTML = '<p class="error">メールアドレスの形式が正しくありません。</p>';
        return;
    }

    // 確認メッセージ表示
    results.innerHTML = `
    <p class="success">以下の内容で予約を受け付けました：</p>
    <ul>
      <li><strong>お名前：</strong>${name}</li>
      <li><strong>日時：</strong>${datetime.replace("T", " ")}</li>
      <li><strong>人数：</strong>${people}</li>
      <li><strong>電話番号：</strong>${phone}</li>
      <li><strong>メールアドレス：</strong>${email}</li>
      <li><strong>内容：</strong>${message}</li>
    </ul>
  `;

    form.reset(); // 入力内容をリセット
});