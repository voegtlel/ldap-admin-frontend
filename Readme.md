<a href="https://cloud.docker.com/repository/docker/voegtlel/ldap-admin-frontend/builds">
  <img src="https://img.shields.io/docker/cloud/build/voegtlel/ldap-admin-frontend.svg" alt="Docker build status" />
</a>
<img src="https://img.shields.io/github/license/voegtlel/ldap-admin-backend.svg" alt="License" />


# Client for ldap admin

This is the frontend for [ldap-admin-backend](https://github.com/voegtlel/ldap-admin-backend).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Docker

The docker image is located at `voegtlel/ldap-admin-frontend`.

## Docker compose
```
version: '3'
services:
  frontend:
    image: voegtlel/ldap-admin-frontend
    restart: unless-stopped
    environment:
      # Forward backend to /api
      # (will set API_HOST='/api')
      PROXY_API_HOST: backend
      # OR: Host backend at separate URL:
      # API_HOST: 'api.example.com'
    port:
      # Serve at :80, you may for sure also use a reverse proxy, etc.
      - 80:80
    networks:
      - backend

  backend:
    image: voegtlel/ldap-admin-backend
    restart: unless-stopped
    environment:
      # Define how to connect to the ldap server
      API_CONFIG_LDAP_SERVER_URI: 'ldap://openldap'
      # How to bind the ldap admin
      API_CONFIG_LDAP_BIND_DN: 'cn=useradmin,ou=services,dc=jdav-freiburg,dc=de'
      API_CONFIG_LDAP_BIND_PASSWORD: 'HaeCoth8muPhepheiphi'
      # General API prefix.
      API_CONFIG_LDAP_PREFIX: 'dc=jdav-freiburg,dc=de'
      
      # Override any config.yaml variable by typing API_CONFIG_<container>_<container...>_<variable>
      # where the names are automagically converted from camelCase to underscore_notation (ignoring casing).
      
      # Set this if you use different origin
      # API_CONFIG_ALLOW_ORIGINS: "['https://admin.example.com']"
    networks:
      - backend
  
  ldap:
    image: yourldapserver
    networks:
      - backend
networks:
  ldap:
    external: true
  backend:
```
