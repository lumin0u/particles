class Vector
{
    x: number;
    y: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    distanceSquared(other: Vector)
    {
        return (this.x - other.x)**2 + (this.y - other.y)**2;
    }

    distance(other: Vector)
    {
        return Math.sqrt(this.distanceSquared(other));
    }

    multiply(m: number): Vector
    {
        this.x *= m;
        this.y *= m;
        return this;
    }

    add(other: Vector): Vector
    {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    subtract(other: Vector): Vector
    {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    dot(other: Vector)
    {
	return other.x * this.x + other.y * this.y;
    }

    length(): number
    {
        return this.distance(new Vector(0, 0));
    }

    normalize(): Vector
    {
        let length = this.length();
        this.x = this.x / length;
        this.y = this.y / length;
        return this;
    }

    clone(): Vector
    {
        return new Vector(this.x, this.y);
    }

    static from(from: Vector, to: Vector)
    {
        return new Vector(to.x - from.x, to.y - from.y);
    }
}
