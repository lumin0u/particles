class Chunk
{
    particles = new Array<Particle>();
    world: World;
    position: Vector;

    constructor(world: World, position: Vector)
    {
        this.world = world;
        this.position = position;
    }

    draw(ctx: CanvasRenderingContext2D, relative: number)
    {
        /*ctx.strokeStyle = "#000000";
        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.moveTo(this.position.x*CHUNK_SIZE, this.position.y*CHUNK_SIZE);
        ctx.lineTo((this.position.x+1)*CHUNK_SIZE, this.position.y*CHUNK_SIZE);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.position.x*CHUNK_SIZE, this.position.y*CHUNK_SIZE);
        ctx.lineTo(this.position.x*CHUNK_SIZE, (this.position.y+1)*CHUNK_SIZE);
        ctx.closePath();
        ctx.stroke();*/

        this.particles.forEach(particle => particle.draw(ctx, relative));
    }

    tick()
    {
        let neighbors = [...this.particles];
        this.world.getChunksAround(this).forEach(chunk => neighbors = neighbors.concat(chunk.particles));

        for(let particle of this.particles)
        {
            particle.newToChunk = false;
            for(let neighbor of neighbors)
            {
                if(neighbor === particle)
                {
                    continue;
                }

                let distanceMultiplier = (Math.max(Math.min(Constants.ATTRACT_DISTANCE - particle.position.distance(neighbor.position), Constants.ATTRACT_DISTANCE - 6), 0) / Constants.ATTRACT_DISTANCE) ** 2;
                let force = particle.type.behaviour.get(neighbor.type) * 0.025;

                particle.velocity.x += (neighbor.position.x - particle.position.x) * force * distanceMultiplier;
                particle.velocity.y += (neighbor.position.y - particle.position.y) * force * distanceMultiplier;
            }
        }
    }

    postTick()
    {
        let neighbors = [...this.particles];
        this.world.getChunksAround(this).forEach(chunk => neighbors = neighbors.concat(chunk.particles));

        for(let particle of this.particles)
        {
            if(particle.newToChunk)
            {
                continue;
            }

            let lastX = particle.position.x;
            let lastY = particle.position.y;

            let newX = particle.position.x + particle.velocity.x;
            let newY = particle.position.y + particle.velocity.y;

            particle.lastPosition = new Vector(lastX, lastY);

            particle.position.x = newX;
            particle.position.y = newY;

            if(Constants.COLLISIONS)
            {
                for(let neighbor of neighbors)
                {
                    if(neighbor === particle)
                    {
                        continue;
                    }

                    if(neighbor.position.distanceSquared(particle.position) < 36)
                    {
                        let v0 = particle.velocity.clone();
                        let v1 = neighbor.velocity.clone();
                        
                        let vAB = neighbor.position.clone().subtract(particle.position).normalize();
                        
                        let vaScalairized = vAB.clone().multiply(vAB.dot(v0));
                        let vbScalairized = vAB.clone().multiply(vAB.dot(v1));
                        
                        let diffScalaires = vbScalairized.clone().subtract(vaScalairized);
                        
                        particle.velocity = v0.clone().add(diffScalaires);
                        //neighbor.velocity = v1.clone().subtract(diffScalaires);

                        //let vector = Vector.from(neighbor.position, particle.position);
                        //particle.velocity.add(vector.normalize().multiply((6 - neighbor.position.distance(particle.position)) / 36));
                    }
                }
            }

            particle.velocity.multiply(Constants.FRICTION_FACTOR);

            if(Math.floor(lastX / CHUNK_SIZE) !== Math.floor(newX / CHUNK_SIZE) || Math.floor(lastY / CHUNK_SIZE) !== Math.floor(newY / CHUNK_SIZE))
            {
                particle.newToChunk = true;
                if(this.world.getChunkAt(particle.position) !== null)
                {
                    this.world.getChunkAt(particle.position).particles.push(particle);
                }
                this.particles = this.particles.filter(anyParticle => anyParticle !== particle);
            }
        }
    }
}