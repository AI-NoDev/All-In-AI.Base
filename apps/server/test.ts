import z from 'zod/v4'

console.log(z.toJSONSchema(z.any()))
console.log(z.toJSONSchema(z.number()))
console.log(z.toJSONSchema(z.object({
    a: z.string(),
    b:z.number(),
    c:z.unknown(),
    d:z.array(z.union([z.string(), z.number(), z.enum(['1','2'])])),
    e:z.any()
})))