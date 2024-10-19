# The starting image
FROM nginx:1.23

# Author
LABEL authors="AD-158"

# Delete the default config
RUN rm /etc/nginx/nginx.conf

# Replace with a custom one
ADD nginx.conf /etc/nginx/nginx.conf
COPY ./conf /etc/nginx/sites-enabled