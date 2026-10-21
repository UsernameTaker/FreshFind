package org.robofinder.repo;

import org.robofinder.model.ZipLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZipLocationRepository extends JpaRepository<ZipLocation, String> {
}
