package com.fitzone.member.config;

import com.fitzone.member.dto.MemberDTOs.EventoPago;
import com.fitzone.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class RabbitMQConfig {

    public static final String PAYMENT_QUEUE = "payment.confirmed.queue";
    public static final String PAYMENT_EXCHANGE = "fitzone.exchange";
    public static final String PAYMENT_ROUTING_KEY = "payment.confirmed";

    private final MemberService memberService;

    @Bean
    public Queue paymentQueue() {
        return QueueBuilder.durable(PAYMENT_QUEUE).build();
    }

    @Bean
    public TopicExchange fitZoneExchange() {
        return new TopicExchange(PAYMENT_EXCHANGE);
    }

    @Bean
    public Binding paymentBinding(Queue paymentQueue, TopicExchange fitZoneExchange) {
        return BindingBuilder.bind(paymentQueue).to(fitZoneExchange).with(PAYMENT_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }

    @RabbitListener(queues = PAYMENT_QUEUE)
    public void handlePaymentConfirmed(EventoPago event) {
        log.info("Evento de pago recibido: {}", event);
        memberService.activateMembershipFromPayment(event);
    }
}
