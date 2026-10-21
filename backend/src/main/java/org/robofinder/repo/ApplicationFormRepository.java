package org.robofinder.repo;

import org.robofinder.model.ApplicationForm;
import org.robofinder.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ApplicationFormRepository extends JpaRepository<ApplicationForm, Long> {
    Optional<ApplicationForm> findByTeam(Team team);
    Optional<ApplicationForm> findByTeamId(Long teamId);

    @Query("select f from ApplicationForm f where f.team.id in :teamIds")
    List<ApplicationForm> findByTeamIds(Collection<Long> teamIds);
}
