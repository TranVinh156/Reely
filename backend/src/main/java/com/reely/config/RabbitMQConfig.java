package com.reely.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String COMMENT_QUEUE = "comment.queue";
    public static final String COMMENT_EXCHANGE = "comment.exchange";
    public static final String COMMENT_ROUTING_KEY = "comment.notification";

    public static final String COMMENT_RETRY_QUEUE = "comment.retry.queue";
    public static final String COMMENT_RETRY_ROUTING_KEY = "comment.retry";
    public static final String COMMENT_DLQ = "comment.dlq";
    public static final String COMMENT_DLQ_ROUTING_KEY = "comment.dlq.notification";
    public static final String ERROR_EXCHANGE = "comment.error.exchange";

    public static final String LIKE_QUEUE = "like.queue";
    public static final String LIKE_EXCHANGE = "like.exchange";
    public static final String LIKE_ROUTING_KEY = "like.notification";

    public static final String LIKE_RETRY_QUEUE = "like.retry.queue";
    public static final String LIKE_RETRY_ROUTING_KEY = "like.retry";
    public static final String LIKE_DLQ = "like.dlq";
    public static final String LIKE_DLQ_ROUTING_KEY = "like.dlq.notification";

    @Bean
    public Queue commentQueue() {
        return QueueBuilder.durable(COMMENT_QUEUE)
                .withArgument("x-dead-letter-exchange",  ERROR_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", COMMENT_RETRY_ROUTING_KEY)
                .build();
    }

    @Bean
    public Queue commentRetryQueue() {
        return QueueBuilder.durable(COMMENT_RETRY_QUEUE)
                .withArgument("x-message-ttl", 5000)
                .withArgument("x-dead-letter-exchange", COMMENT_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", COMMENT_ROUTING_KEY)
                .build();
    }

    @Bean
    public Queue commentDLQ() {
        return QueueBuilder.durable(COMMENT_DLQ).build();
    }

    @Bean
    public Queue likeQueue() {
        return QueueBuilder.durable(LIKE_QUEUE)
                .withArgument("x-dead-letter-exchange", ERROR_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", LIKE_RETRY_ROUTING_KEY)
                .build();
    }

    @Bean
    public Queue likeRetryQueue() {
        return QueueBuilder.durable(LIKE_RETRY_QUEUE)
                .withArgument("x-message-ttl", 5000)
                .withArgument("x-dead-letter-exchange", LIKE_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", LIKE_ROUTING_KEY)
                .build();
    }

    @Bean
    public Queue likeDLQ() {
        return QueueBuilder.durable(LIKE_DLQ).build();
    }

    @Bean
    public TopicExchange commentExchange() {
        return new TopicExchange(COMMENT_EXCHANGE, true, false);
    }

    @Bean
    public DirectExchange errorExchange() {
        return new DirectExchange(ERROR_EXCHANGE, true, false);
    }

    @Bean
    public TopicExchange likeExchange() {
        return new TopicExchange(LIKE_EXCHANGE, true, false);
    }


    @Bean
    public Binding commentBinding() {
        return BindingBuilder
                .bind(commentQueue())
                .to(commentExchange())
                .with(COMMENT_ROUTING_KEY);
    }

    @Bean
    public Binding commentRetryBinding() {
        return BindingBuilder
                .bind(commentRetryQueue())
                .to(errorExchange())
                .with(COMMENT_RETRY_ROUTING_KEY);
    }

    @Bean
    public Binding commentDLQBinding() {
        return BindingBuilder
                .bind(commentDLQ())
                .to(errorExchange())
                .with(COMMENT_DLQ_ROUTING_KEY);
    }

    @Bean
    public Binding likeBinding() {
        return BindingBuilder
                .bind(likeQueue())
                .to(likeExchange())
                .with(LIKE_ROUTING_KEY);
    }

    @Bean
    public Binding likeRetryBinding() {
        return BindingBuilder
                .bind(likeRetryQueue())
                .to(errorExchange())
                .with(LIKE_RETRY_ROUTING_KEY);
    }

    @Bean
    public Binding likeDLQBinding() {
        return BindingBuilder
                .bind(likeDLQ())
                .to(errorExchange())
                .with(LIKE_DLQ_ROUTING_KEY);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
