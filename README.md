ER Diagram

![Alt Text](/image/image.png)

## Installation

```bash
$ npm install
```

## Running the docker

```bash
$ docker compose up -d
```

## Running the app

```bash
$ npm run start
```

## Seed user, currency, wallet for mock data
```bash
$ node src/seeders/user.seeder.js    
```
## Use path for test on postman

Create order 
`POST: http://localhost:3000/order`
```json
{
    "userId": 1 ,
    "type": "sell", //choose type buy or sell
    "currencyType": "ETH",
    "currencyRecieve":"USD",
    "amount": 1,
    "status":"pending"
}
```


Get all users

`GET: http://localhost:3000/users` 

Get all wallets

`GET: http://localhost:3000/wallets`

Get all order

`GET: http://localhost:3000/order`

Get all transaction

`GET: http://localhost:3000/transaction`




