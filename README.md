# include-action

Github action to process simple `#include "some/file"` directives as known from the C preprocessor. The orginal intention was to allow including Dockerfile snippets to avoid code duplication but it can be used for any type of files.

## Example Files

`php73cli.Dockerfile`
```
ARG PHP_VERSION="7.3"
ARG PHP_TYPE="cli"

#include "php.Dockersnippet"
```

`php.Dockersnippet`
```
FROM php:${PHP_VERSION}-${PHP_TYPE}-alpine

SHELL ["/bin/ash", "-eo", "pipefail", "-c"]

#include "global.Dockersnippet"

#hadolint ignore=DL3018,SC2086
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && docker-php-ext-install opcache \
    && docker-php-ext-enable opcache \
    && apk del .build-deps
```

`global.Dockersnippet`
```
#hadolint ignore=DL3018
RUN apk add --no-cache make
```

## Example usage:

```
- name: Build Dockerfile
  uses: zolex/include-action@v1
  with:
    input: php73cli.Dockerfile
    output: php73cli.Dockerfile.out
```

The Result will be the following:

`php73cli.Dockerfile.out`

```
ARG PHP_VERSION="7.3"
ARG PHP_TYPE="cli"

FROM php:${PHP_VERSION}-${PHP_TYPE}-alpine

SHELL ["/bin/ash", "-eo", "pipefail", "-c"]

#hadolint ignore=DL3018
RUN apk add --no-cache make

#hadolint ignore=DL3018,SC2086
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && docker-php-ext-install opcache \
    && docker-php-ext-enable opcache \
    && apk del .build-deps
```
