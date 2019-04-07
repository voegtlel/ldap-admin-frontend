# Client for ldap admin

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
    # TODO: forward backend to /api
    environment:
      BACKEND_HOST: backend
    port:
      - 80:80
    networks:
      - frontend

  backend:
    image: voegtlel/ldap-admin-backend
    restart: unless-stopped
    environment:
      API_CONFIG_LDAP_SERVER_URI: 'ldap://openldap'
      API_CONFIG_LDAP_BIND_DN: 'cn=useradmin,ou=services,dc=jdav-freiburg,dc=de'
      API_CONFIG_LDAP_BIND_PASSWORD: 'HaeCoth8muPhepheiphi'
      API_CONFIG_PREFIX: 'dc=jdav-freiburg,dc=de'
      # Set this if you have a different origin
      # API_CONFIG_ALLOW_ORIGINS: "['https://admin.jdav-freiburg.de']"

    networks:
      - ldap
      - frontend
  
  ldap:
    image: 
networks:
  ldap:
    external: true
  frontend:
```
