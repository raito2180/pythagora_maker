import { useEffect } from "react"
import { createObject } from "utils/matterjs/objects/CreateObjects"
import { ObjectType } from "utils/GameSetting"
import { Engine, Render, Composite, Runner } from "matter-js"

export const Object = () => {
  useEffect(() => {
    const ball = {
                  x: 100,
                  y: 80,
                  option: {
                    label: "ball",
                    isStatic: true
                  },
                  radius: 30,
                  bodiesType: "Circle"
                  };

    const object = createObject(ball, ObjectType.Ball);
    const engine = Engine.create({
      enableSleeping: true,
      gravity: {
        x: 0,
        y: 0
      }
    });

    const render = Render.create({
      element: document.getElementById("object"),
      engine: engine,
      options: {
        width: 461,
        height: 496,
        wireframes: false,
        background: "transparent"
      }
    });

    Composite.add(engine.world, object.getObject());

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
  }, []);

  return (
    <div id="object" className="border-b-2 border-r-2 border-l-2 border-gray-500"></div>
  );
};
