#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'node:fs/promises'

const program = new Command()

program
  .argument('<route>', '页面')

const [command, route] = program.args

// const dir = 
// /[.+*?^${}()[\]/\\]/g

export {}