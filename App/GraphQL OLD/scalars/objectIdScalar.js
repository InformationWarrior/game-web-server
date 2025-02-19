const { GraphQLScalarType, Kind } = require('graphql');
const { ObjectId } = require('mongodb');

const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Custom scalar type for MongoDB ObjectId',
  serialize(value) {
    if (!value) return null;
    if (value instanceof ObjectId) return value.toString();
    if (typeof value === "string") return value;
    throw new Error('Invalid ObjectId');
  },
  parseValue(value) {
    return new ObjectId(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new ObjectId(ast.value);
    return null;
  },
});

module.exports = ObjectIdScalar;
