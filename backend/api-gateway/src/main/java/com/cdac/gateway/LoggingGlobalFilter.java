//package com.cdac.gateway;
//
//import java.lang.System.Logger;
//
//import org.springframework.cloud.gateway.filter.GatewayFilterChain;
//import org.springframework.cloud.gateway.filter.GlobalFilter;
//import org.springframework.core.Ordered;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//
//import com.sun.org.slf4j.internal.LoggerFactory;
//
//import reactor.core.publisher.Mono;
//
//@Component
//public class LoggingGlobalFilter implements GlobalFilter, Ordered {
//
//
//    private static final Logger log = LoggerFactory.getLogger(LoggingGlobalFilter.class);
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//
//        long startTime = System.currentTimeMillis();
//
//        ServerHttpRequest request = exchange.getRequest();
//
//        log.info(
//                "Incoming request → METHOD={}, PATH={}, REMOTE_ADDRESS={}",
//                request.getMethod(),
//                request.getURI().getPath(),
//                request.getRemoteAddress()
//        );
//
//        return chain.filter(exchange)
//                .doOnSuccess(aVoid -> {
//                    long duration = System.currentTimeMillis() - startTime;
//                    log.info(
//                            "Outgoing response → PATH={}, STATUS={}, TIME_TAKEN={}ms",
//                            request.getURI().getPath(),
//                            exchange.getResponse().getStatusCode(),
//                            duration
//                    );
//                });
//    }
//
//    @Override
//    public int getOrder() {
//        return -1; // run early
//    }
//
//}
