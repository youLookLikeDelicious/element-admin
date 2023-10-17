#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'

const program = new Command()
program
  .version('1.0.0')
  .name('artisan')
  .description(chalk.green('Element Admin Cli'))
  .command('make:page [name]', '新建一个页面', { executableFile: 'cli/page-make-command' })
  .command('make:picker [name]', '新建一个选择器')
  .command('route:list', '查看所有路由')
  .parse(process.argv)

const options = program.opts()
console.log(program.args)
export {}