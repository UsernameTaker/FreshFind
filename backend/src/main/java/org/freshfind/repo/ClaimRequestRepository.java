package org.freshfind.repo;

import org.freshfind.model.ClaimRequest;
import org.freshfind.model.ClaimStatus;
import org.freshfind.model.Team;
import org.freshfind.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRequestRepository extends JpaRepository<ClaimRequest, Long> {
    List<ClaimRequest> findByStatusOrderByCreatedAtAsc(ClaimStatus status);
    boolean existsByTeamAndUserAndStatus(Team team, User user, ClaimStatus status);
    List<ClaimRequest> findByTeamAndStatus(Team team, ClaimStatus status);
}
