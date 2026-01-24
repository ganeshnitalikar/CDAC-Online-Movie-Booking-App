package com.cdac.entities;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrewMember {

    private String id;
    private String name;
    private String role;
}
