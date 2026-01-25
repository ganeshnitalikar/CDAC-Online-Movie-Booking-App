package com.cdac.gateway;

import java.util.UUID;

import org.jboss.logging.MDC;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class TraceIdGlobalFilter implements GlobalFilter, Ordered {

    private static final String TRACE_ID = "traceId";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String traceId = exchange.getRequest()
                .getHeaders()
                .getFirst(TRACE_ID);

        if (traceId == null) {
            traceId = UUID.randomUUID().toString();
        }

        exchange.getRequest().mutate()
                .header(TRACE_ID, traceId)
                .build();

        MDC.put(TRACE_ID, traceId);

        return chain.filter(exchange)
                .doFinally(signalType -> MDC.clear());
    }

    @Override
    public int getOrder() {
        return -1; // run early
    }
}
