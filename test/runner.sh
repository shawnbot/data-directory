#!/bin/sh
(node load.js | diff - expected.json) || exit 1
