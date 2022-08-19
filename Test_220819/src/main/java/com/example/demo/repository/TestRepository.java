package com.example.demo.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.SubEntity;
import com.example.demo.entity.TestEntity;

public interface TestRepository extends JpaRepository<TestEntity, String> {
	
	
//	@Query(value="select * from table_5 t left outer join sub_table s on t.col3 = s.sub1 where t.col1 = :col1" , nativeQuery = true)
//    List<TestEntity> findAll(@Param("col1") String col1, @Param("col2") String col2);
	
	
//	@Query(value="select * from table_5 t left outer join sub_table s on t.col3 = s.sub1 where t.col2 like %:col2%" , nativeQuery = true)
//	List<TestEntity> findAllcol2(@Param("col2") String col2);
//	 
//	@Query(value="select * from table_5 t left outer join sub_table s on t.col3 = s.sub1 where t.col1 like %:col1%" , nativeQuery = true)
//	List<TestEntity> findAllcol1(@Param("col1") String col1);
//	
//	@Query(value="select * from table_5 t left outer join sub_table s on t.col3 = s.sub1 where t.col1 like %:col1% and t.col2 like %:col2% ", nativeQuery = true)
//	List<TestEntity> findAll(@Param("col1") String col1, @Param("col2") String col2);

//	@Query(value="select sub1 from sub_table" , nativeQuery = true)
//	ArrayList<String> findBySub1();
	
	
	
	//FK로 안 묶여 있어도 필드명으로 다들 테이블의 값을 불러오는 법이다.
	//List<TestEntity> findByCol1AndSubEntity_sub2(String col2, String col22);

	List<TestEntity> findByCol1ContainingAndCol2Containing(String col1, String col2);

	
	
}
