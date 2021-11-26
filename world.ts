const CHUNK_SIZE = 50;

class World
{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    chunks: Chunk[] = [];
    particleTypes: ParticleType[] = [];
    
    constructor(canvas: HTMLCanvasElement, types: ParticleType[] = null)
    {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        //instantiate chunks
        for(let x = 0; x < Math.ceil(canvas.width/CHUNK_SIZE); x++)
        {
            for(let y = 0; y < Math.ceil(canvas.height/CHUNK_SIZE); y++)
            {
                this.chunks.push(new Chunk(this, new Vector(x, y)));
            }
        }

        //create particle types

        if(types === null)
        {
            let colors = ["#AA0000", "#00AA00", "#0000AA", "#888800", "#880088", "#008888"];

            for(let i = 0; i < Constants.TYPE_COUNT; i++)
            {
                this.particleTypes.push(new ParticleType(colors[i % 6]));
            }
        }
        else
        {
            this.particleTypes = [...types];
        }

        //apply behaviours
        if(types === null)
            this.particleTypes.forEach(type1 => this.particleTypes.forEach(type2 => type1.addBehaviour(type2, Math.random()*Constants.STRENGTH-Constants.STRENGTH/2)));

        //create particles
        for(let i = 0; i < Constants.PARTICLE_COUNT; i++)
        {
            let position = new Vector(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
            this.addParticle(this.particleTypes[Math.floor(Math.random()*this.particleTypes.length)], position);
        }

    }

    getChunkAt(position: Vector): Chunk
    {
        let chunk = null;

        for(let achunk of this.chunks)
        {
            if(achunk.position.x === Math.floor(position.x/CHUNK_SIZE) && achunk.position.y === Math.floor(position.y/CHUNK_SIZE))
            {
                chunk = achunk;
            }
        }

        return chunk;
    }

    getChunksAround(chunk: Chunk): Array<Chunk>
    {
        let chunks = new Array<Chunk>();

        for(let achunk of this.chunks)
        {
            if(achunk !== chunk && Math.abs(achunk.position.x - chunk.position.x) <= 1 && Math.abs(achunk.position.y - chunk.position.y) <= 1)
            {
                chunks.push(achunk);
            }
        }

        return chunks;
    }

    addParticle(type: ParticleType, pos: Vector)
    {
        this.getChunkAt(pos).particles.push(new Particle(type, pos, this));
    }

    draw(relative: number)
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.chunks.forEach(chunk => chunk.draw(this.ctx, relative));
    }

    tick()
    {
        this.chunks.forEach(chunk => {
            chunk.tick();
        });
        this.chunks.forEach(chunk => {
            chunk.postTick();
        });
    }
}