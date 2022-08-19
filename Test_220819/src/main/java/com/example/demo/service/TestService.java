package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.ComSubCdEntity;
import com.example.demo.entity.SubEntity;
import com.example.demo.entity.TestEntity;

public interface TestService {
	public TestEntity insertCol(TestEntity te);

	public List<TestEntity> selectAll();

//	public Optional<TestEntity> selectOne(String col1);
	public int del(TestEntity te);

//	public List<TestEntity> searchcol2(String col2);
//
//	public List<TestEntity> searchcol1(String col1);
//
//	public List<TestEntity> searchall(String col1, String col2);

//	public ArrayList<String> findBySub1();
	
	public List<TestEntity> search(String col1, String col2);

//	public List<SubEntity> findall();

	public List<ComSubCdEntity> findallSubCd();
}
