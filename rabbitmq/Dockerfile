# Basic RabbitMQ image
FROM rabbitmq:3.7.8-management

# We create the necessary users and virtual hosts, grant rights to users
ADD ./config/definitions.json /etc/rabbitmq/
ADD ./config/rabbitmq.config /etc/rabbitmq/
ADD --chown=rabbitmq ./config/definitions.json /etc/rabbitmq/
RUN chown rabbitmq:rabbitmq /etc/rabbitmq/rabbitmq.config /etc/rabbitmq/definitions.json
ENV RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS="-rabbitmq_management load_definitions \"/etc/rabbitmq/definitions.json\""