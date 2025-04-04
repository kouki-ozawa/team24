# setup

.env.sampleを.env.localという名前でコピーして必要な情報を書き込みます

```sh
npm install
npm run dev
```

# storeの使い方

```js
//読み取り
import { useSelector } from "react-redux";

const userId = useSelector((state) => state.user.userId);

//書き込み
import { useDispatch } from "react-redux";
import { setUserId, clearUserId, loadUserId } from "../store/userSlice";

const dispatch = useDispatch();
dispatch(setUserId("12345")); // セット
dispatch(clearUserId()); // ログアウト
dispatch(loadUserId()); // localStorageから読み込み
```
