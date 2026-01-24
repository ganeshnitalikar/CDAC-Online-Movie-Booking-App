package com.cdac.dtos.response;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CrewResponse {
    private String id;
    private String name;
    private String role;
}
