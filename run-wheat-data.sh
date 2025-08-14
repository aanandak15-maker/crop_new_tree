#!/bin/bash

# Wheat Data Population Script
# This script will populate your Supabase database with comprehensive wheat data

echo "🌾 Wheat Data Population Script"
echo "================================"

# Check if credentials file exists
if [ ! -f "db-credentials.txt" ]; then
    echo "❌ Error: db-credentials.txt not found!"
    echo "Please create this file with your database credentials first."
    exit 1
fi

# Source the credentials (you'll need to fill these in)
source db-credentials.txt

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set in db-credentials.txt"
    echo "Please fill in your database credentials first."
    exit 1
fi

echo "✅ Database credentials loaded"
echo "🚀 Executing wheat data script..."

# Execute the SQL script
psql "$DATABASE_URL" -f test-wheat-data.sql

if [ $? -eq 0 ]; then
    echo "✅ Wheat data successfully populated!"
    echo "🌾 Your database now contains:"
    echo "   - Wheat crop information"
    echo "   - 8 wheat varieties"
    echo "   - 7 wheat pests"
    echo "   - 8 wheat diseases"
    echo "   - Wheat images"
    echo ""
    echo "🎉 You can now test your crop explorer with rich wheat data!"
else
    echo "❌ Error executing the script"
    echo "Please check your database credentials and connection"
fi
