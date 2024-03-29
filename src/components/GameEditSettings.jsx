import {
  useRef,
  useEffect,
  useState
} from 'react';
import {
  Composite
} from 'matter-js';
import {
  createObject
} from 'utils/matterjs/objects/CreateObjects';
import {
  ObjectType,
  PythagoraStartX,
  StageStartX,
  StageEndX,
  StageEditorUserPlacementCenterX
} from 'utils/GameSetting';

export const GameEditSettings = ({
  engine,
  gameData,
  selectObjectRef,
  selectObjectX,
  setSelectObjectX,
  selectObjectY,
  setSelectObjectY,
  selectObjectType,
  setSelectObjectType
}) => {
  const widthRef = useRef();
  const heightRef = useRef();
  const xRef = useRef();
  const yRef = useRef();
  const radiusRef = useRef();
  const sidesRef = useRef();
  const angleRef = useRef();
  const [objectType, setObjectType] = useState();
  const [isOnUser, setIsOnUser] = useState(false);
  const staticRef = useRef("static");
  const themeRef = useRef(1);
  const reGenerateObjectRef = useRef();
  const DEFAULT_X = 0;
  const DEFAULT_Y = 0;
  const DEFAULT_ANGLE = 0;
  const DEFAULT_RECTANGLE_WIDTH = 10;
  const DEFAULT_RECTANGLE_HEIGHT = 10;
  const DEFAULT_CIRCLE_RADIUS = 10;
  const DEFAULT_TRIANGLE_HEIGHT = 10;
  const DEFAULT_POLYGON_SIDES = 4;
  const DEFAULT_POLYGON_RADIUS = 10;
  const WIDTH_ZERO = 0;
  const HEIGHT_ZERO = 0;
  const SELECT_OBJECT_OUTLINE_WIDTH = 5;
  const EDIT_SCALE = 2 / 3;
  const HALF_SCALE = 1 / 2;

  useEffect(() => {
    if (!engine) return;

    setXY();
    setSizeSettings();
    setType();

  }, [engine, selectObjectX, selectObjectY, selectObjectType]);

  useEffect(() => {
    if (!engine) return;

    setStatic();
  }, [selectObjectX, objectType]);

  // X座標とY座標を設定
  const setXY = () => {
    // オブジェクトが選択されていないもしくはパレット上の場合は座標を0にする
    if (!selectObjectRef.current || isOnPalette(selectObjectX)) {
      xRef.current.value = DEFAULT_X;
      yRef.current.value = DEFAULT_Y;
      return;
    }

    // x座標はステージの開始点を0として設定
    xRef.current.value = selectObjectX ? selectObjectX - StageStartX : DEFAULT_X;
    yRef.current.value = selectObjectY ? selectObjectY : DEFAULT_Y;

    // ユーザー配置にあるオブジェクトかどうかを設定
    setIsOnUser(selectObjectX < StageStartX);
  }

  // サイズ関連の項目を設定
  const setSizeSettings = () => {
    // オブジェクトが選択されていない場合はサイズと角度を0にする
    if (!selectObjectType || !selectObjectRef.current) {
      widthRef.current.value = WIDTH_ZERO;
      heightRef.current.value = HEIGHT_ZERO;
      angleRef.current.value = DEFAULT_ANGLE;
      return;
    }

    // 長方形の場合
    if (selectObjectType === 'Rectangle') {
      const object = selectObjectRef.current.getParent();
      widthRef.current.value = object.object.width;
      heightRef.current.value = object.object.height;
      angleRef.current.value = object.object.angle ? object.object.angle : DEFAULT_ANGLE;
      return;
    }

    // 円の場合
    if (selectObjectType === 'Circle') {
      const object = selectObjectRef.current.getParent();
      radiusRef.current.value = object.object.radius;
      return;
    }

    // 三角形の場合
    if (selectObjectType === 'Triangle') {
      const object = selectObjectRef.current.getParent();
      heightRef.current.value = object.object.height;
      angleRef.current.value = object.object.angle ? object.object.angle : DEFAULT_ANGLE;
      return;
    }

    // 多角形の場合
    if (selectObjectType === 'Polygon') {
      const object = selectObjectRef.current.getParent();
      sidesRef.current.value = object.object.sides;
      radiusRef.current.value = object.object.radius;
      angleRef.current.value = object.object.angle ? object.object.angle : DEFAULT_ANGLE;
      return;
    }
  }

  // オブジェクトの種類を設定
  const setType = () => {
    // オブジェクトが選択されていない場合はステージを選択
    if (!selectObjectRef.current) {
      setObjectType('Stage');
      return;
    }

    setObjectType(selectObjectRef.current.getParent().object.objectType);
  }

  // オブジェクトの固定設定を設定
  const setStatic = () => {
    if (objectType !== 'Stage' || isOnUser) return;

    // オブジェクトが選択されていない場合は固定するを選択
    if (!selectObjectRef.current) {
      staticRef.current.value = 'static';
      return;
    }

    // ラベルに応じて固定設定を設定
    const label = selectObjectRef.current.getParent().object.label
    staticRef.current.value = (label === 'stageMove' || label === "userMove") ? 'dynamic' : 'static';
  }


  // ボディタイプに応じてオブジェクトを再生成
  const reGenerateObject = () => {
    // オブジェクト未選択もしくはパレット上の場合は処理をしない
    if (!selectObjectRef.current || isOnPalette(selectObjectX)) return;

    // 共通の設定
    const x = (xRef.current.value ? Number(xRef.current.value) : DEFAULT_X) + StageStartX;
    const y = yRef.current.value ? Number(yRef.current.value) : DEFAULT_Y;
    const object = selectObjectRef.current.getParent().object;
    let label = null;
    // ステージの場合、移動できるかどうかでラベルを変更
    if (isOnUser) {
      label = staticRef.current.value === 'static' ? 'userStatic' : 'userMove';
    } else if (objectType === 'Stage') {
      label = staticRef.current.value === 'static' ? 'stage' : 'stageMove';
    } else {
      label = object.label;
    }
    const bodiesType = object.bodiesType;
    const objectId = object.objectId;
    const theme = themeRef.current.value;

    let property = {
      x: x,
      y: y,
      option: {
        objectId: objectId,
        isStatic: true,
        label: label,
        bodiesType: bodiesType,
        objectType: objectType,
        theme: theme
      },
      bodiesType: bodiesType,
    };

    // 長方形の場合
    if (bodiesType === 'Rectangle') {
      const width = widthRef.current.value ? Number(widthRef.current.value) : DEFAULT_RECTANGLE_WIDTH;
      const height = heightRef.current.value ? Number(heightRef.current.value) : DEFAULT_RECTANGLE_HEIGHT;
      const angle = angleRef.current.value ? parseFloat(angleRef.current.value) : DEFAULT_ANGLE;

      property.width = width;
      property.height = height;
      property.option.width = width;
      property.option.height = height;
      property.option.angle = angle;

      reGenerateObjectRef.current = createObject(property, objectType).getObject();
    }

    // 円の場合
    if (bodiesType === 'Circle') {
      const radius = radiusRef.current.value ? Number(radiusRef.current.value) : DEFAULT_CIRCLE_RADIUS;

      property.radius = radius;
      property.option.radius = radius;

      reGenerateObjectRef.current = createObject(property, objectType).getObject();
    }

    // 三角形の場合
    if (bodiesType === 'Triangle') {
      const height = heightRef.current.value ? Number(heightRef.current.value) : DEFAULT_TRIANGLE_HEIGHT;
      const angle = angleRef.current.value ? parseFloat(angleRef.current.value) : DEFAULT_ANGLE;

      property.height = height;
      property.option.height = height;
      property.option.angle = angle;

      reGenerateObjectRef.current = createObject(property, objectType).getObject();
    }

    // 多角形の場合
    if (bodiesType === 'Polygon') {
      const sides = sidesRef.current.value ? Number(sidesRef.current.value) : DEFAULT_POLYGON_SIDES;
      const radius = radiusRef.current.value ? Number(radiusRef.current.value) : DEFAULT_POLYGON_RADIUS;
      const angle = angleRef.current.value ? parseFloat(angleRef.current.value) : DEFAULT_ANGLE;

      property.sides = sides;
      property.radius = radius;
      property.option.sides = sides;
      property.option.radius = radius;
      property.option.angle = angle;

      reGenerateObjectRef.current = createObject(property, objectType).getObject();
    }

    Composite.remove(engine.world, selectObjectRef.current);
    Composite.add(engine.world, reGenerateObjectRef.current);
    selectObjectRef.current = reGenerateObjectRef.current;
    reGenerateObjectRef.current = null;
    setSelectObjectX(selectObjectRef.current.position.x);
    setSelectObjectY(selectObjectRef.current.position.y);
    setSelectObjectType(selectObjectRef.current.bodiesType);
    selectObjectRef.current.render.lineWidth = SELECT_OBJECT_OUTLINE_WIDTH;
    selectObjectRef.current.render.strokeStyle = "red";
    const parent = selectObjectRef.current.getParent();
    parent.multiplyScale(EDIT_SCALE);
    if (selectObjectRef.current.position.x < StageStartX) parent.multiplyScale(HALF_SCALE);
  }

  // オブジェクトをリセット
  const resetObject = () => {
    // オブジェクト未選択の場合は処理をしない
    if (!selectObjectRef.current) return;

    const parent = selectObjectRef.current.getParent();

    // パレットから複製してきたオブジェクトの場合は削除
    if (parent.object.label.startsWith('Palette')) {
      Composite.remove(engine.world, selectObjectRef.current);
      setSelectObjectX(null);
      setSelectObjectY(null);
      setSelectObjectType(null);
      selectObjectRef.current = null;
      return;
    }

    // データベースから読み込んだオブジェクトの場合は再生成
    const contents = gameData.content;

    let source = null;

    Object.values(contents).forEach((content) => {
      if (Array.isArray(content)) {
        content.forEach((object) => {
          if (object.option.objectId !== parent.object.objectId) return;

          source = object;
        });
        return;
      }
      if (content.option.objectId !== parent.object.objectId) return;

      source = content;
    });

    const type = source.option.objectType;
    // ユーザー配置オブジェクトの場合はステージオブジェクトとして再生成
    const clone = createObject(source, type === ObjectType.UserPlacement ? ObjectType.Stage : type);
    changeScale(clone);
    const resizedClone = clone.getObject();

    // ユーザー配置オブジェクトの場合はオブジェクトタイプにステージを設定
    if (type === ObjectType.UserPlacement) {
      resizedClone.objectType = ObjectType.Stage;
    }

    Composite.add(engine.world, resizedClone);
    Composite.remove(engine.world, selectObjectRef.current);
    selectObjectRef.current = resizedClone;
    setSelectObjectX(resizedClone.position.x);
    setSelectObjectY(resizedClone.position.y);
    setSelectObjectType(resizedClone.bodiesType);
  }

  const removeObject = () => {
    // オブジェクト未選択の場合は処理をしない
    if (!selectObjectRef.current) return;

    Composite.remove(engine.world, selectObjectRef.current);
    selectObjectRef.current = null;
    setSelectObjectX(null);
    setSelectObjectY(null);
    setSelectObjectType(null);
  }

  // オブジェクトタイプが変更されたときの処理
  const changeObjectType = (e) => {
    setObjectType(e.target.value);
  }

  // データベースから読み込んだオブジェクトの座標および大きさを編集画面に合わせて変更
  const changeScale = (object) => {
    const position = object.getPosition();
    object.multiplyScale(EDIT_SCALE);
    const posY = Math.round(position.y * EDIT_SCALE);
    if (object.object.objectType === ObjectType.UserPlacement) {
      object.setPosition({ x: StageEditorUserPlacementCenterX, y: posY });
      object.multiplyScale(HALF_SCALE);
      return;
    }
    const posX = Math.round(((position.x - PythagoraStartX) * EDIT_SCALE) + StageStartX);
    object.setPosition({ x: posX, y: posY });
  }

  // x座標がパレット上にあるか判定
  const isOnPalette = (x) => {
    return x > StageEndX;
  }

  return (
    <div className="h-full flex flex-col border-b-2 border-r-2 border-l-2 border-black">
      <div className="w-full h-1/2 flex">
        {(selectObjectType === null || selectObjectType === 'Rectangle') && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>幅</label>
            <input type="number" ref={widthRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === null || selectObjectType === 'Rectangle') && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>高さ</label>
            <input type="number" ref={heightRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === null || selectObjectType === 'Rectangle') && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>角度</label>
            <input type="number" step="0.1" ref={angleRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Circle') && (
          <div className="w-3/6 h-full flex flex-col items-center">
            <label>大きさ</label>
            <input type="number" ref={radiusRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Triangle') && (
          <div className="w-2/6 h-full flex flex-col items-center">
            <label>大きさ</label>
            <input type="number" ref={heightRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Triangle') && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>角度</label>
            <input type="number" step="0.1" ref={angleRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Polygon') && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>角の数</label>
            <input type="number" ref={sidesRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Polygon') && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>大きさ</label>
            <input type="number" ref={radiusRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Polygon') && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>角度</label>
            <input type="number" step="0.1" ref={angleRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        <div className="w-1/6 h-full flex flex-col items-center">
          <label>X座標</label>
          <input type="number" ref={xRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
        </div>
        <div className="w-1/6 h-full flex flex-col items-center">
          <label>Y座標</label>
          <input type="number" ref={yRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
        </div>
        <div className="w-1/6 h-full flex flex-col items-center">
          <label>種類</label>
          <select value={objectType} onChange={changeObjectType} className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center">
            <option value="Ball">ボール</option>
            <option value="Stage">ステージ</option>
            <option value="Switch">スイッチ</option>
          </select>
        </div>
      </div>
      <div className="w-full h-1/2 flex items-center justify-end">
        <div className="w-1/6 h-full flex flex-col items-center">
          <label>固定するか</label>
          <select ref={staticRef} className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center">
            <option value="static">固定する</option>
            <option value="dynamic">固定しない</option>
          </select>
        </div>
        <div className="w-1/6 h-full flex flex-col items-center">
          <label>テーマ</label>
          <select ref={themeRef} className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center">
            <option value="1">RUNTEQ</option>
            <option value="2">Cosmos</option>
            <option value="3">Farm</option>
            <option value="4">SweetsLand</option>
            <option value="5">Beach</option>
            <option value="6">Dragon</option>
            <option value="7">Osaka</option>
            <option value="8">Cyberpunk</option>
          </select>
          <small className='text-xs'>※反映はプレイ画面にて</small>
        </div>
        <div className="w-1/6 h-full flex items-center justify-center">
          <button
            type="button"
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            onClick={removeObject}
          >削除</button>
        </div>
        <div className="w-1/6 h-full flex items-center justify-center">
          <button
            type="button"
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            onClick={resetObject}
          >リセット</button>
        </div>
        <div className="w-1/6 h-full flex items-center justify-center">
          <button
            type="button"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={reGenerateObject}
          >反映</button>
        </div>
      </div>
    </div>
  );
}