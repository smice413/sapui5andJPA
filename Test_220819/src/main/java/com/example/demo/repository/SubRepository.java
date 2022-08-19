package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.SubEntity;


public interface SubRepository extends JpaRepository<SubEntity, String> {

	List<SubEntity> findBySub1(String a);

	//List<SubEntity> findBySub1();
}
