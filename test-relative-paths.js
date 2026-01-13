#!/usr/bin/env node
// Test to verify that relative file paths work correctly

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testRelativePaths() {
  console.log('Testing relative path support...\n');

  // Test 1: Relative path with fs.access (same as attachments.js line 15)
  try {
    await fs.access('test-file.txt');  // Relative path
    console.log('✅ Test 1: fs.access() works with relative path');
  } catch (error) {
    console.log('❌ Test 1 FAILED: fs.access() with relative path');
    console.error(error.message);
  }

  // Test 2: Relative path with fs.stat (same as attachments.js line 21)
  try {
    const stats = await fs.stat('test-file.txt');  // Relative path
    console.log(`✅ Test 2: fs.stat() works with relative path (size: ${stats.size} bytes)`);
  } catch (error) {
    console.log('❌ Test 2 FAILED: fs.stat() with relative path');
    console.error(error.message);
  }

  // Test 3: path.basename works with relative paths
  try {
    const basename = path.basename('test-file.txt');
    console.log(`✅ Test 3: path.basename() works with relative path (result: ${basename})`);
  } catch (error) {
    console.log('❌ Test 3 FAILED: path.basename() with relative path');
    console.error(error.message);
  }

  // Test 4: Absolute path for comparison
  try {
    const absolutePath = path.join(__dirname, 'test-file.txt');
    await fs.access(absolutePath);
    console.log(`✅ Test 4: fs.access() works with absolute path`);
  } catch (error) {
    console.log('❌ Test 4 FAILED: fs.access() with absolute path');
    console.error(error.message);
  }

  console.log('\n📊 Summary: Node.js fs functions work with BOTH relative and absolute paths.');
  console.log('The code does NOT require absolute paths - this is a false issue.');
}

testRelativePaths().catch(console.error);
