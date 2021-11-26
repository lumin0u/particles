let world: World;

let Itps = 5;
let tps = Itps;

document.onkeydown = event => tps=Itps*10;
document.onkeyup = event => tps=Itps;

let onBodyLoad = () => 
{
    let canvas = <HTMLCanvasElement> document.getElementById("canvas1");
    canvas.width = document.body.clientWidth - 30;
    canvas.height = document.body.clientHeight - 30;

    world = new World(canvas);

    let time = 0;

    setInterval(() =>
    {
        if(time % tps === 0)
        {
            world.tick();
        }
        world.draw((time%tps)/tps);
        time++;
    }, 1);
};

let restart = (keepRules: boolean) => 
{
    let canvas = <HTMLCanvasElement> document.getElementById("canvas1");
    world = new World(canvas, keepRules ? world.particleTypes : null);
};

console.log("Hey ! You may want to create a new set of rules in this simulation, to do so, type restart()");

class Constants
{
    static TYPE_COUNT = 6;
    static PARTICLE_COUNT = 5000;
    static STRENGTH = 10;
    static COLLISIONS = false;

    static ATTRACT_DISTANCE = 50;
    static FRICTION_FACTOR = 0.975;
}