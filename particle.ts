class Particle
{
    type: ParticleType;
    lastPosition: Vector;
    position: Vector;
    velocity: Vector;
    world: World;
    newToChunk = false;

    constructor(type: ParticleType, position: Vector, world: World)
    {
        this.type = type;
        this.position = position;
        this.lastPosition = position;
        this.world = world;
        this.velocity = new Vector(0, 0);
    }

    draw(ctx: CanvasRenderingContext2D, relative: number)
    {
        ctx.fillStyle = this.type.color;
        ctx.beginPath();
        ctx.arc(this.lastPosition.x + this.velocity.x*relative, this.lastPosition.y + this.velocity.y*relative, 3, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}

class ParticleType
{
    behaviour = new Map<ParticleType, number>();
    color: string;

    constructor(color: string)
    {
        this.color = color;
    }

    addBehaviour(type: ParticleType, force: number)
    {
        this.behaviour.set(type, force);
    }
}