#!/usr/bin/env node
import 'dotenv/config';
import glpushruleCommand from './commands/_glpushrule';

glpushruleCommand.parse(process.argv);
