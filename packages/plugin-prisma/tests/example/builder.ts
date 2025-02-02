import SchemaBuilder from '@pothos/core';
import ComplexityPlugin from '@pothos/plugin-complexity';
import ErrorsPlugin from '@pothos/plugin-errors';
import RelayPlugin from '@pothos/plugin-relay';
import SimpleObjects from '@pothos/plugin-simple-objects';
import PrismaPlugin from '../../src';
// eslint-disable-next-line import/no-useless-path-segments
import { Prisma, PrismaClient } from '../client/index';
import { Decimal } from '../client/runtime';
import PrismaTypes from '../generated';

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

const builder = new SchemaBuilder<{
  Scalars: {
    Decimal: {
      Input: Decimal;
      Output: Decimal;
    };
  };
  Context: {
    user: { id: number };
  };
  PrismaTypes: PrismaTypes;
  AuthScopes: {
    user: boolean;
  };
}>({
  plugins: [ErrorsPlugin, PrismaPlugin, RelayPlugin, ComplexityPlugin, SimpleObjects],
  relayOptions: {},
  prisma: {
    filterConnectionTotalCount: true,
    client: () => prisma,
    dmmf: Prisma.dmmf,
    exposeDescriptions: true,
  },
  errorOptions: {
    defaultTypes: [Error],
  },
});

builder.scalarType('Decimal', {
  serialize: (value) => value.toString(),
  parseValue: (value) => {
    if (typeof value !== 'string') {
      throw new TypeError('Decimal must be a string');
    }

    return new Decimal(value);
  },
});

export default builder;
