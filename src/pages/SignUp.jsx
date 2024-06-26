import Style from "./style.module.css";
import { useState } from "react";
import Header from "components/Header";
import supabase from "services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { RoutePath } from "utils/RouteSetting";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [name, setName] = useState(""); // ユーザー名のステートを追加

  const signUpSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConf) {
      alert("パスワードが一致しません。");
      return;
    }
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (signUpError) {
        throw signUpError;
      }
      // ユーザー登録が成功したらその場でログインしてプロファイル情報を追加
      // このアプリでは認証確認メールを介してユーザー登録する手順をスキップしています
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (signInError) {
        throw signInError;
      }
      if (data) {
        const userId = data.user.id;
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{ user_id: userId, name: name, role: "一般" }]);
        if (profileError) {
          throw profileError;
        }
        alert("ユーザー登録とプロファイル設定が完了しました。");
        setUser(data); // ユーザー情報を設定
        navigate(RoutePath.stageSelect.path);
        window.location.reload()
      }
    } catch (error) {
      alert("エラーが発生しました: " + error.message);
    }
  };

  return (
    <>
      <div className="w-full h-full relative font-[DotGothic16]">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100%-40px)]">
          <div className="p-10 rounded-3xl text-center max-w-screen-lg mx-auto">
            <h1 className="text-4xl  mb-6">　新規ユーザー登録画面　</h1>
            <form
              className="flex flex-col items-center gap-4 w-full px-1"
              onSubmit={signUpSubmit}
            >
              <div className="flex w-full max-w-md items-center">
                <input
                  type="text"
                  id="name"
                  placeholder="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border-4 focus:outline-none focus:border-yellow-500 rounded"
                />
              </div>

              <div className="flex w-full max-w-md items-center">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border-4 focus:outline-none focus:border-yellow-500 rounded"
                />
              </div>

              <div className="flex w-full max-w-md items-center">
                <input
                  type="password"
                  id="password"
                  placeholder="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border-4 focus:outline-none focus:border-yellow-500 rounded"
                />
              </div>

              <div className="flex w-full max-w-md items-center">
                <input
                  type="password"
                  id="password-confirm"
                  placeholder="password確認"
                  required
                  value={passwordConf}
                  onChange={(e) => setPasswordConf(e.target.value)}
                  className="w-full p-2 border-4 focus:outline-none focus:border-yellow-500 rounded"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className={Style.button}
                >
                  Let's Sign Up!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
