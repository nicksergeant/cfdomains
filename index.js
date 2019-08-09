#!/usr/bin/env node

require('dotenv').config();

const moment = require('moment');
const request = require('request-promise');
const { blue, red, green } = require('chalk');

const apiUrl = endpoint => ({
  url: `https://api.cloudflare.com/client/v4/${endpoint}`,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Email': 'nick@flxsoftware.com',
    'X-Auth-Key': process.env.CLOUDFLARE_API_KEY
  }
});

const req = async endpoint => {
  return await request(apiUrl(endpoint)).then(body => {
    return JSON.parse(body);
  });
};

const colorized = ({ value, condition }) => {
  return condition ? green(value) : red(value);
};

const run = async () => {
  const accounts = await req('accounts');
  const accountId = accounts.result[0].id;
  const domains = await req(`accounts/${accountId}/registrar/domains`);

  domains.result.map(d => {
    const nameLength = d.name.length;

    if (nameLength > 20) {
      spacing = '\t';
    } else if (nameLength < 14) {
      spacing = '\t\t\t';
    } else {
      spacing = '\t\t';
    }

    const registrar = colorized({
      value: d.current_registrar.substr(0, 10),
      condition: d.current_registrar === 'Cloudflare'
    });

    const renew = colorized({
      value: d.auto_renew || false,
      condition: Boolean(d.auto_renew)
    });

    const locked = colorized({
      value: d.locked || false,
      condition: Boolean(d.locked)
    });

    const expires = colorized({
      value: moment(d.expires_at).format('L'),
      condition: moment(d.expires_at).isAfter(moment().add(6, 'months'))
    });

    console.log(
      `${d.name}  ${spacing}Reg: ${registrar}\t  Renew: ${renew}\tLocked: ${locked}\tExpires: ${expires}`
    );

    // administrator_contact
    // auto_renew
    // available
    // billing_contact
    // can_register
    // cloudflare_dns
    // cloudflare_registration
    // contacts_updated_at
    // current_registrar
    // ds_records
    // expires_at
    // fees
    // last_transferred_at
    // locked
    // name
    // name_servers
    // payment_expires_at
    // pending_transfer
    // registrant_contact
    // registry_object_id
    // registry_statuses
    // supported_tld
    // technical_contact
    // transfer_conditions
  });
};

run();
