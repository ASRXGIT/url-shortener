#!/bin/bash

# Run start command for the client folder
cd client
npm start &

# Run start command for server folder
cd ../server
npm run dev &
