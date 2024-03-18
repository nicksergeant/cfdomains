#!/usr/bin/env node

require('dotenv').config();

const axios = require('axios');
const moment = require('moment');
const { red, green } = require('chalk');

const apiUrl = endpoint => ({
  url: `https://api.cloudflare.com/client/v4/${endpoint}`,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
    'X-Auth-Key': process.env.CLOUDFLARE_API_KEY
  }
});

const req = async endpoint => {
  return await axios(apiUrl(endpoint)).then(body => {
    return body.data
  });
};

const colorized = ({ value, condition }) => {
  return condition ? green(value) : red(value);
};

const run = async () => {
  const { result: page1 } = await req(`zones?per_page=50&page=1`);

  page1.map(z => {
    console.log(z.name)
  });

  const { result: page2 } = await req(`zones?per_page=50&page=2`);

  page2.map(z => {
    console.log(z.name)
  });
};

run();
