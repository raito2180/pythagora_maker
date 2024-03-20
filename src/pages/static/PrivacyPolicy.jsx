import Style from './static.module.css'

const PrivacyPolicy = () => {
  return (
    <article className={`mt-16 m-auto w-full ${Style.role}`}>
      <h2 className="text-center w-4/5 m-auto text-3xl py-8">プライバシーポリシー</h2>
      <section className="bg-white rounded w-4/5 m-auto p-8">
        <div>
          <p></p>
        </div>
        <div>
          <h4>ユーザーから取得する情報</h4>
          <p>当アプリは、ユーザーから以下の情報を取得します。</p>
          <ul>
            <li>氏名（ニックネームやペンネームも含む）</li>
            <li>メールアドレス</li>
            <li>OSTが生成するID、端末の種類、端末識別子等のユーザーが利用するOSや端末に関する情報</li>
          </ul>
        </div>
        <div>
          <h4>ユーザーの情報を利用する目的</h4>
          <p>当アプリは、ユーザーから取得した情報を、以下の目的のために利用します。</p>
          <ul>
            <li>当アプリに関する登録の受付、ユーザーの本人確認、認証のため</li>
            <li>ユーザーの当アプリの利用履歴を管理するため</li>
            <li>ユーザーからのお問い合わせに対応するため</li>
            <li>当アプリの規約や法令に違反する行為に対応するため</li>
            <li>当アプリの変更、提供中止、終了、契約解除をご連絡するため</li>
            <li>当アプリ規約の変更等を通知するため</li>
            <li>以上の他、当アプリの提供、維持、保護及び改善のため</li>
          </ul>
        </div>
        <div>
          <h4>安全管理のために講じた措置</h4>
          <p>当アプリが、ユーザーから取得した情報に関して安全管理のために講じた措置につきましては、末尾記載のお問い合わせ先にご連絡をいただきましたら、法令の定めに従い個別にご回答させていただきます。</p>
        </div>
        <div>
          <h4>第三者提供</h4>
          <p>当アプリは、ユーザーから取得する情報のうち、個人データ（個人情報保護法第１６条第３項）に該当するものついては、あらかじめユーザーの同意を得ずに、第三者（日本国外にある者を含みます。）に提供しません。<br />
            但し、次の場合は除きます。</p>
          <ul>
            <li>個人データの取扱いを外部に委託する場合</li>
            <li>当アプリや当アプリが買収された場合</li>
            <li>事業パートナーと共同利用する場合（具体的な共同利用がある場合は、その内容を別途公表します。）</li>
            <li>その他、法律によって合法的に第三者提供が許されている場合</li>
          </ul>
        </div>
        <div>
          <h4>アクセス解析ツール</h4>
          <p>当アプリは、ユーザーのアクセス解析のために、「Googleアナリティクス」を利用しています。Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。Cookieを無効にすれば、これらの情報の収集を拒否することができます。詳しくはお使いのブラウザの設定をご確認ください。Googleアナリティクスについて、詳しくは以下からご確認ください。<br />
            <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" className="underline ml-2">https://marketingplatform.google.com/about/analytics/terms/jp/</a></p>
        </div>
        <div>
          <h4>プライバシーポリシーの変更</h4>
          <p>当アプリは、必要に応じて、このプライバシーポリシーの内容を変更します。この場合、変更後のプライバシーポリシーの施行時期と内容を適切な方法により周知または通知します。</p>
        </div>
        <h4>お問い合わせ</h4>
        <p>
          ユーザーの情報の開示、情報の訂正、利用停止、削除をご希望の場合は、下記の窓口までお願いいたします。<br />
          <a href="#" className="underline ml-2" >お問合せフォーム</a>
        </p>
        <p>以上</p>
      </section>
    </article>
  )
}

export default PrivacyPolicy