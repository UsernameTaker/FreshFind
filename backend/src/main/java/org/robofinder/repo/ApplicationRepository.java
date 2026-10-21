package org.robofinder.repo;

import org.robofinder.model.Application;
import org.robofinder.model.ApplicationStatus;
import org.robofinder.model.Team;
import org.robofinder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentOrderByUpdatedAtDesc(User student);
    Optional<Application> findByTeamIdAndStudent(Long teamId, User student);
    List<Application> findByTeamAndStatusNotInOrderBySubmittedAtDesc(Team team, Collection<ApplicationStatus> excluded);
    long countByStatusNot(ApplicationStatus status);
}
