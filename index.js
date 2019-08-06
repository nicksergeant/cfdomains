#!/usr/bin/env node

const { blue, red, green } = require('chalk');
const request = require('request-promise');

const apiUrl = endpoint => ({
  url: `https://api.cloudflare.com/client/v4/${endpoint}`,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Email': 'nick@flxsoftware.com',
    'X-Auth-Key': 'ba240ad5e7a8a3e096d4187b32c39106deb2b'
  }
});

const req = async endpoint => {
  return await request(apiUrl(endpoint)).then(body => {
    return JSON.parse(body);
  });
};

const run = async () => {
  const accounts = await req('accounts');
  const account = accounts.result[0].id;
  console.log(account);

  // Get domains.
  // List each domain with:
  // - name
  // - date of expiration
  // - auto-renew enabled
  // - domain lock enabled
};

run();
