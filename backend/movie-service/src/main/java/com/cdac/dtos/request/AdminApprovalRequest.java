package com.cdac.dtos.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminApprovalRequest {

    @NotNull(message = "Approval status is required")
    private Boolean approved;
}
