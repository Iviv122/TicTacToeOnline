#!/bin/bash

path=$(pwd)
cd $path/client
pnpm install
pnpm build

cd $path/server
bun install
bun build --compile --target bun --outfile $path/server_exec $path/server/src/index.ts
