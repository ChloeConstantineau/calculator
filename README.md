# Calculus

<p align="center">
  <img src="./assets/icons8-calculator.svg" width="200" alt="Nest Logo" />
</p>

## Description

Repository containing a simple calculator application. It handled positive integers with operators +, -, \*, /, (, )

## Requests

The app can handle the following request:

1. Calculus

```sh
GET /calculus?query=[input]
```

| Detail                 | Request                                                | Response                                                                                                                                                                     | Raw Input                    |
| ---------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Valid Input            | `/calculus?query=MiAqICgyMy8oMyozKSktIDIzICogKDIqMyk=` | `{"error":false,"result":-132.88888888888889}`                                                                                                                               | `2 * (23/(3*3))- 23 * (2*3)` |
| Invalid Characters     | `/calculus?query=MiAqIGVeMg==MiAqIGVeMg==`             | `{"statusCode":400,"message":"Bad Request","error":"Invalid Operators found; Valid operators are [0-9], *, /, +, -, (, )"}`                                                  | `2 * e^2`                    |
| Unbalanced Parentheses | `/calculus?query=KDIqNCkrKCgzNC04KQ==`                 | `{"statusCode":400,"message":"Bad Request","error":"Unbalanced Parentheses; Input contains invalid parentheses patterns."}`                                                  | `(2*4)+((34-8)`              |
| Invalid Operators      | `/calculus?query=KC0yKzEp`                             | `{"statusCode":400,"message":"Bad Request","error":"Invalid Operation; Operators such as +, -, * or / should be preceded and followed by a number or a parentheses group."}` | `(-2+1)`                     |

2.OpenAPI documentation

```sh
/api
```

## Installation

```bash
yarn
```

## Running the app

Copy the sample environment variables with `cp .sample-env .env`.

Start the application:

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Local Docker

```bash
# Build
$ docker build . -t calculator

# Run
$ docker -p 3000:3000 run calculator
```

```sh GET /calculus?query=[input]
curl -v http://localhost:3000/calculus?query=MiAqICgyMy8oMyozKSktIDIzICogKDIqMyk=`
```

## Infra

[See Infra ReadMe.md](./infra/README.md)

## CI / CD

CI: Uses github action `push.yaml` for every commit pushed on any branch

CD: Uses manually triggered github action `deployment.yaml` on branch `main` only

## Deployment

Currently deployed under: `https://xumyxtmmps.us-east-1.awsapprunner.com/`

1.Valid Input

```sh GET /calculus?query=[input]
curl -v https://xumyxtmmps.us-east-1.awsapprunner.com/calculus?query=MiAqICgyMy8oMyozKSktIDIzICogKDIqMyk=
```

2.Invalid Characters

```sh GET /calculus?query=[input]
curl -v https://xumyxtmmps.us-east-1.awsapprunner.com/calculus?query=MiAqIGVeMg==MiAqIGVeMg==
```

3.Unbalanced Parentheses

```sh GET /calculus?query=[input]
curl -v https://xumyxtmmps.us-east-1.awsapprunner.com/calculus?query=KDIqNCkrKCgzNC04KQ==
```

4.Invalid Operators

```sh GET /calculus?query=[input]
curl -v https://xumyxtmmps.us-east-1.awsapprunner.com/calculus?query=KC0yKzEp
```

## License

Nest is [MIT licensed](LICENSE).

Calculator icon by [Icons8](https://icons8.com/icon/oTyxAxj0tuPz/calculator)
