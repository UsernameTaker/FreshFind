package org.robofinder.repo;

import org.robofinder.model.ClaimRequest;
import org.robofinder.model.ClaimStatus;
import org.robofinder.model.Team;
import org.robofinder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRequestRepository extends JpaRepository<ClaimRequest, Long> {
    List<ClaimRequest> findByStatusOrderByCreatedAtAsc(ClaimStatus status);
    boolean existsByTeamAndUserAndStatus(Team team, User user, ClaimStatus status);
    List<ClaimRequest> findByTeamAndStatus(Team team, ClaimStatus status);
}
