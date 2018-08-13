var fetch = require('node-fetch')

const key = process.env.API_KEY

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

async function createEmailSubscriber(listId, email) {
  const url = 'https://emailoctopus.com/api/1.4/lists/' + listId + '/contacts'
  const data = {
    api_key: key,
    email_address: email,
    status: 'SUBSCRIBED',
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  }).then(response => response.json())
}

function createErrorResponse(message, statusCode, data) {
  const response = {
    statusCode: statusCode || 400,
    headers: responseHeaders,
    body: JSON.stringify({
      metadata: { 'success': false, 'message': message },
      data: data || null,
    }),
  }

  return response
}

function createResponse(data) {
  const response = {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify({
      metadata: { 'success': true },
      data: data,
    }),
  }

  return response
}

module.exports.createSubscriber = async (event, context) => {
  let userData = JSON.parse(event.body)
  const { email, listId } = userData
  const data = await createEmailSubscriber(listId, email)

  if (data.error) {
    return createErrorResponse(data.error.message)
  } else {
    return createResponse(data)
  }
}
