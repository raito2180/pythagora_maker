import { Engine, Render } from "matter-js";

export const StageEditor = () => {
  const engine = Engine.create(
    {
      enableSleeping: true,
      gravity: {
        x: 0,
        y: 0
      }
    }
  );

  const render = Render.create(
    {
      element: document.getElementById("stageEditor"),
      engine: engine,
      options: {
        width: 587,
        height: 496,
        wireframes: false,
        background: "transparent"
      },
    }
  );

  return (
    <div id="stageEditor" className="w-[587px] h-[496px] border-b-2 border-r-2 border-l-2 border-gray-500">
      b
    </div>
  );
}