# Deployment

We used nginx as our HTTP server and reverse proxy server.

##  For nginx

We haved tested on the following configurations:
  - Digital Ocean with Droplet Configuration (512MB RAM and 20 GB SSD)
  - Ubuntu 16.04.2 x64

### Installation

Install [nginx](https://nginx.org/en/). By default Ubuntu should have nginx in its official repository.

```sh
$ sudo apt-get install nginx
```

### Initial Configuration

Once you have installed nginx it's time to configure your site.

```sh
$ cd /etc/nginx/sites-available
$ nano "Your Site Domain Name"."Your site TLD"
# For Ex: nano bits-atmos.org
```

We used the following template to configure our site. You can change it as per your needs.

```sh
upstream app_bits-atmos.org {
    # port 3000 represents the port on which our node app is listening, you
    # may change the port depending on the port which your app is listening to
    server 127.0.0.1:3000;
    keepalive 8;
}

# the nginx server instance
server {
    # we configured our nginx to listen to port 80 as we exposed 
    # port 80 only in our server. make sure your exposed ports
    # are accessible by the outside world.
    listen 0.0.0.0:80;
    server_name bit-atmos.org bits-atmos;
    access_log /var/log/nginx/bits-atmos.log;

    # pass the request to the node.js server with the correct headers
    # and much more can be added, see nginx config options
    location / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      proxy_pass http://app_bits-atmos.org/;
      proxy_redirect off;
    }
	location ~ /.well-known {
                allow all;
        }
 }
```
After saving your template. Test the configurations if they are accepted by nginx by running the following command.

```sh
$ nginx -t
# a valid configuration file would output.
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Run the server
```sh
# To restart
$ sudo systemctl restart nginx
# To start
$ sudo systemctl start nginx
```

Test your connection if reverse proxy has worked by opening it in a browser from your computer.

Alternatively use curl to test the connection.
```sh
$ curl -I <domain-name>
```
