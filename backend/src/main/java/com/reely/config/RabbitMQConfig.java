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

    public static final String LIKE_QUEUE = "like.queue";
    public static final String LIKE_EXCHANGE = "like.exchange";
    public static final String LIKE_ROUTING_KEY = "like.notification";

    @Bean
    public Queue commentQueue() {
        return QueueBuilder.durable(COMMENT_QUEUE).build();
    }

    @Bean
    public Queue likeQueue() {
        return QueueBuilder.durable(LIKE_QUEUE).build();
    }

    @Bean
    public TopicExchange commentExchange() {
        return new TopicExchange(COMMENT_EXCHANGE, true, false);
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
    public Binding likeBinding() {
        return BindingBuilder
                .bind(likeQueue())
                .to(likeExchange())
                .with(LIKE_ROUTING_KEY);
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
